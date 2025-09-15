import os
from flask import Flask, render_template, request, redirect, url_for, send_from_directory

app = Flask(__name__)
UPLOAD_FOLDER = 'uploads'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# Ensure base upload folder exists
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# ---------------------- ROUTES ----------------------

@app.route('/')
def home():
    classes = ["Class8", "Class9", "Class10"]
    return render_template("index.html", classes=classes)

@app.route('/class/<cls>')
def class_page(cls):
    subjects = ["Science", "SocialScience"]
    return render_template("class.html", cls=cls, subjects=subjects)

@app.route('/subject/<cls>/<subject>')
def subject_page(cls, subject):
    return render_template("subject.html", cls=cls, subject=subject)

@app.route('/notes/<cls>/<subject>')
def notes_page(cls, subject):
    chapters = ["Chapter1", "Chapter2"]
    return render_template("notes.html", cls=cls, subject=subject, chapters=chapters)

@app.route('/upload/<cls>/<subject>/<chapter>', methods=['POST'])
def upload_file(cls, subject, chapter):
    # check password first
    password = request.form.get("password")
    if password != "123":
        return "Unauthorized! Wrong password."

    if 'file' not in request.files:
        return "No file uploaded!"
    file = request.files['file']
    if file.filename == '':
        return "No selected file!"

    save_path = os.path.join(app.config['UPLOAD_FOLDER'], cls, subject, "Notes", chapter)
    os.makedirs(save_path, exist_ok=True)
    file.save(os.path.join(save_path, file.filename))

    return redirect(url_for("chapter_page", cls=cls, subject=subject, chapter=chapter))


@app.route('/chapter/<cls>/<subject>/<chapter>')
def chapter_page(cls, subject, chapter):
    folder = os.path.join(app.config['UPLOAD_FOLDER'], cls, subject, "Notes", chapter)
    files = os.listdir(folder) if os.path.exists(folder) else []
    return render_template("chapter.html", cls=cls, subject=subject, chapter=chapter, files=files)

@app.route('/download/<cls>/<subject>/<chapter>/<filename>')
def download_file(cls, subject, chapter, filename):
    folder = os.path.join(app.config['UPLOAD_FOLDER'], cls, subject, "Notes", chapter)
    return send_from_directory(folder, filename, as_attachment=True)

# -------- TEXTBOOK --------
@app.route('/textbook/<cls>/<subject>')
def textbook_page(cls, subject):
    folder = os.path.join(app.config['UPLOAD_FOLDER'], cls, subject, "Textbook")
    os.makedirs(folder, exist_ok=True)
    files = os.listdir(folder)
    return render_template("textbook.html", cls=cls, subject=subject, files=files)

@app.route('/upload_textbook/<cls>/<subject>', methods=['POST'])
def upload_textbook(cls, subject):
    # check password first
    password = request.form.get("password")
    if password != "123":
        return "Unauthorized! Wrong password."

    if 'file' not in request.files:
        return "No file uploaded!"
    file = request.files['file']
    if file.filename == '':
        return "No selected file!"

    save_path = os.path.join(app.config['UPLOAD_FOLDER'], cls, subject, "Textbook")
    os.makedirs(save_path, exist_ok=True)
    file.save(os.path.join(save_path, file.filename))

    return redirect(url_for("textbook_page", cls=cls, subject=subject))


@app.route('/download_textbook/<cls>/<subject>/<filename>')
def download_textbook(cls, subject, filename):
    folder = os.path.join(app.config['UPLOAD_FOLDER'], cls, subject, "Textbook")
    return send_from_directory(folder, filename, as_attachment=True)

@app.route('/pdf/<cls>/<subject>/<chapter>/<filename>')
def serve_pdf(cls, subject, chapter, filename):
    folder = os.path.join(app.config['UPLOAD_FOLDER'], cls, subject, "Notes", chapter)
    return send_from_directory(folder, filename)

@app.route('/pdf_textbook/<cls>/<subject>/<filename>')
def serve_pdf_textbook(cls, subject, filename):
    folder = os.path.join(app.config['UPLOAD_FOLDER'], cls, subject, "Textbook")
    return send_from_directory(folder, filename)

@app.route('/view_textbook/<cls>/<subject>/<filename>')
def view_textbook(cls, subject, filename):
    return render_template("viewer_textbook.html", cls=cls, subject=subject, filename=filename)


@app.route('/view/<cls>/<subject>/<chapter>/<filename>')
def view_file(cls, subject, chapter, filename):
    return render_template("viewer.html", cls=cls, subject=subject, chapter=chapter, filename=filename)

# ---------------------- MAIN ----------------------
if __name__ == '__main__':
    app.run(debug=True)
