from flask import Flask, request, jsonify
from flask_cors import CORS
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
        prompt = f"""Convert this medical report into a clear, organized summary with bullet points:

{raw_text}

Format:
- Start with 'Patient Summary:'
- Use sections: Patient Info, Medical History, Conditions, Lab Results, Medications, Treatment Plan
- Use bullet points (•)
- Include important numbers
- Explain medical terms briefly
- Highlight critical values
- Be concise"""

        response = await asyncio.to_thread(lambda: groq_client.chat.completions.create(
            messages=[
                {"role": "system", "content": "You are a medical assistant summarizing reports."},
                {"role": "user", "content": prompt}
            ],
            model=GROQ_MODEL,
            temperature=0.3,
            max_tokens=1500
        ))
        return response.choices[0].message.content.strip()

    @staticmethod
    async def simplify_medical_language(summary_text: str) -> str:
        prompt = f"""
You are a medical language simplifier. Convert the summary into plain, friendly language:

{summary_text}

Format:
- Main Problem
- Medical Terms Made Simple
- Doctor Recommends
- What It Means for You

Use a gentle and hopeful tone. Keep it accurate and easy to understand.
if no data from the summary, return answer from whatever knowledge you have.
"""

        response = await asyncio.to_thread(lambda: groq_client.chat.completions.create(
            messages=[
                {"role": "system", "content": "You simplify medical reports for patients."},
                {"role": "user", "content": prompt}
            ],
            model=GROQ_MODEL,
            temperature=0.3,
            max_tokens=1500
        ))
        return response.choices[0].message.content.strip()

    @staticmethod
    def extract_sections(text: str) -> dict:
        sections = {
            "main_problem": "",
            "terms_made_simple": "",
            "doctor_recommends": "",
            "what_it_means": ""
        }

        lines = text.splitlines()
        current_section = None

        for line in lines:
            lower = line.lower().strip()
            if "main problem" in lower:
                current_section = "main_problem"
            elif "medical terms made simple" in lower:
                current_section = "terms_made_simple"
            elif "doctor recommends" in lower:
                current_section = "doctor_recommends"
            elif "what it means for you" in lower:
                current_section = "what_it_means"
            elif current_section:
                sections[current_section] += line + "\n"

        return {k: v.strip() for k, v in sections.items()}

@app.route('/api/parse-pdf', methods=['POST'])
def parse_pdf():
    if 'pdf' not in request.files:
        return jsonify({'error': 'No PDF uploaded'}), 400

    pdf_file = request.files['pdf']
    if not pdf_file.filename.lower().endswith('.pdf'):
        return jsonify({'error': 'Invalid file type'}), 400

    temp_path = None
    try:
        with tempfile.NamedTemporaryFile(suffix='.pdf', delete=False) as tmp:
            temp_path = tmp.name
            pdf_file.save(tmp.name)

        raw_text = PDFProcessor.extract_text_from_pdf(temp_path)
        if not raw_text:
            return jsonify({'error': 'No text could be extracted from PDF'}), 400

        async def run_workflow():
            summary = await ReportSummarizer.summarize_report(raw_text)
            simplified = await ReportSummarizer.simplify_medical_language(summary)
            sections = ReportSummarizer.extract_sections(simplified)
            return summary, simplified, sections

        summary, simplified, sections = asyncio.run(run_workflow())

        return jsonify({
            "summary": summary,
            "main_problem": sections["main_problem"],
            "terms_made_simple": sections["terms_made_simple"],
            "doctor_recommends": sections["doctor_recommends"],
            "what_it_means": sections["what_it_means"]
        })

    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        if temp_path and os.path.exists(temp_path):
            os.remove(temp_path)

if __name__ == '__main__':
    import nest_asyncio
    nest_asyncio.apply()
    app.run(host="0.0.0.0", port=4001, debug=True)