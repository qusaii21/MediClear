from flask import Flask, request, jsonify
from flask_cors import CORS
from aiohttp import ClientSession
import asyncio
import os
import tempfile
from groq import Groq
from PyPDF2 import PdfReader

app = Flask(__name__)
CORS(app)

# Groq Configuration
GROQ_API_KEY = os.getenv("GROQ_API_KEY")
if not GROQ_API_KEY:
    raise RuntimeError("Missing GROQ_API_KEY environment variable")
groq_client = Groq(api_key=GROQ_API_KEY)
GROQ_MODEL = "llama3-70b-8192"

class PDFProcessor:
    @staticmethod
    def extract_text_from_pdf(file_path: str) -> str:
        """Extract raw text from PDF"""
        try:
            text = ""
            with open(file_path, 'rb') as file:
                pdf_reader = PdfReader(file)
                for page in pdf_reader.pages:
                    text += page.extract_text() or ""
            return text.strip()
        except Exception as e:
            raise Exception(f"PDF extraction failed: {str(e)}")

class ReportSummarizer:
    @staticmethod
    async def summarize_report(raw_text: str) -> str:
        """Use LLM to create structured summary in points"""
        prompt = f"""Convert this medical report into a clear, organized summary with bullet points:

{raw_text}

Format requirements:
- Start with 'Patient Summary:'
- Use sections: Patient Info, Medical History, Conditions, Lab Results, Medications, Treatment Plan
- Use bullet points (•) for each item
- Include important numbers and measurements
- Keep medical terms but add brief explanations in parentheses
- Highlight critical values
- Omit unnecessary details"""

        try:
            loop = asyncio.get_event_loop()
            response = await loop.run_in_executor(None, lambda: groq_client.chat.completions.create(
                messages=[
                    {
                        "role": "system", 
                        "content": "You are a medical assistant. Create clear, organized summaries from reports."
                    },
                    {
                        "role": "user", 
                        "content": prompt
                    }
                ],
                model=GROQ_MODEL,
                temperature=0.3,
                max_tokens=1000
            ))
            return response.choices[0].message.content.strip()
        except Exception as e:
            raise Exception(f"Summarization failed: {str(e)}")

@app.route('/api/parse-pdf', methods=['POST'])
async def parse_pdf():
    """Endpoint for PDF processing"""
    if 'pdf' not in request.files:
        return jsonify({'error': 'No PDF uploaded'}), 400

    pdf_file = request.files['pdf']
    if not pdf_file.filename.lower().endswith('.pdf'):
        return jsonify({'error': 'Invalid file type. Please upload a PDF'}), 400

    temp_path = None
    try:
        with tempfile.NamedTemporaryFile(suffix='.pdf', delete=False) as tmp:
            temp_path = tmp.name
            pdf_file.save(tmp.name)

        raw_text = PDFProcessor.extract_text_from_pdf(temp_path)
        if not raw_text:
            return jsonify({'error': 'No text could be extracted from PDF'}), 400

        summary = await ReportSummarizer.summarize_report(raw_text)
        return jsonify({"summary": summary})
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        if temp_path and os.path.exists(temp_path):
            os.remove(temp_path)

async def generate_llm_summary(text_data):
    prompt = f"""
You are a medical assistant explaining medicines to patients. Summarize this information:

{text_data}

Include:
- Purpose of medication
- How it works
- Common side effects
- Important precautions
- Usage instructions

Use simple language with bullet points. If information is missing, say so.

End with:
*Disclaimer: Consult your healthcare provider for medical advice.*"""
    try:
        loop = asyncio.get_event_loop()
        response = await loop.run_in_executor(None, lambda: groq_client.chat.completions.create(
            messages=[
                {"role": "system", "content": "You are a helpful medical assistant."},
                {"role": "user", "content": prompt}
            ],
            model=GROQ_MODEL,
            temperature=0.4,
            max_tokens=512
        ))
        return response.choices[0].message.content.strip()
    except Exception as e:
        print(f"Groq API error: {e}")
        return None

@app.route('/api/explain-medicine', methods=['POST'])
async def explain_medicine():
    data = request.get_json()
    if not data or 'medicineName' not in data or 'patientSummary' not in data:
        return jsonify({'error': 'Missing medicineName or patientSummary'}), 400

    medicine_name = data['medicineName'].strip()
    patient_summary = data['patientSummary']

    prompt = f"""
Based on this patient summary, explain why {medicine_name} was prescribed:

{patient_summary}

Provide 2-3 paragraphs explaining:
1. How this medication helps the patient's conditions
2. Relevant factors from the medical history
3. Important considerations for this patient

Use simple, patient-friendly language."""
    try:
        loop = asyncio.get_event_loop()
        response = await loop.run_in_executor(None, lambda: groq_client.chat.completions.create(
            messages=[
                {"role": "system", "content": "You are a medical translator."},
                {"role": "user", "content": prompt}
            ],
            model=GROQ_MODEL,
            temperature=0.3,
            max_tokens=400
        ))
        return jsonify({'explanation': response.choices[0].message.content.strip()})
    except Exception as e:
        print(f"Explanation error: {e}")
        return jsonify({'error': 'Could not generate explanation'}), 500

async def get_medicine_details(session, medicine_name):
    try:
        openfda_url = f'https://api.fda.gov/drug/label.json?search=openfda.brand_name:"{medicine_name}"+OR+openfda.generic_name:"{medicine_name}"&limit=1'
        async with session.get(openfda_url) as response:
            if response.status == 200:
                data = await response.json()
                if data.get('results'):
                    drug_data = data['results'][0]
                    return {
                        'name': medicine_name,
                        'purpose': ' '.join(drug_data['indications_and_usage']) if 'indications_and_usage' in drug_data else 'No usage information',
                        'side_effects': drug_data.get('warnings', drug_data.get('adverse_reactions', 'No side effects info')),
                        'precautions': drug_data.get('drug_interactions', drug_data.get('precautions', 'No precautions info')),
                        'source': 'OpenFDA'
                    }
    except Exception as e:
        print(f'OpenFDA error: {e}')

    return {
        'name': medicine_name,
        'purpose': 'No information available',
        'side_effects': 'No information available',
        'precautions': 'No information available',
        'source': 'No information found'
    }

@app.route('/api/medicine-info', methods=['POST'])
async def handle_medicine_info():
    data = request.get_json()
    if not data or 'medicines' not in data or not isinstance(data['medicines'], list):
        return jsonify({'error': 'Invalid request format'}), 400

    results = []
    async with ClientSession() as session:
        for med in data['medicines']:
            name = med.get('name', '').strip()
            if not name:
                continue

            details = await get_medicine_details(session, name)
            info_text = f"""
Medication: {details['name']}
Dosage: {med.get('dosage', 'Not specified')}
Instructions: {med.get('instructions', 'Not specified')}
Refills: {med.get('refills', 'Not specified')}
Purpose: {details['purpose']}
Side Effects: {details['side_effects']}
Precautions: {details['precautions']}"""

            llm_summary = await generate_llm_summary(info_text)
            results.append({
                'name': details['name'],
                'dosage': med.get('dosage', ''),
                'instructions': med.get('instructions', ''),
                'refills': med.get('refills', ''),
                'source': details['source'],
                'summary': llm_summary if llm_summary else basic_summary(details),
                'llm_used': bool(llm_summary)
            })
    return jsonify(results), 200

def basic_summary(details):
    summary = []
    if details['purpose'] and 'No usage' not in details['purpose']:
        summary.append(f"Main Use: {details['purpose']}")
    if details['side_effects'] and 'No side effects' not in details['side_effects']:
        summary.append(f"Possible Side Effects: {details['side_effects']}")
    if details['precautions'] and 'No precautions' not in details['precautions']:
        summary.append(f"Precautions: {details['precautions']}")
    return '\n\n'.join(summary) if summary else 'No information available'

if __name__ == '__main__':
    app.run(port=4000, debug=True)