# 🦴 Bone Fracture Detection and Classification using Vision Transformer

An AI-powered medical imaging system that automatically detects bone fractures from X-ray images and classifies the fracture type using deep learning.

This project uses a **Vision Transformer (ViT-B/16)** architecture to build a two-stage pipeline capable of assisting doctors in fracture diagnosis.

---

# 📌 Project Overview

Bone fractures are commonly diagnosed through X-ray analysis by radiologists. However, manual diagnosis can be time-consuming and requires medical expertise.

This project proposes an **AI-assisted fracture detection system** that:

1. Detects whether a bone fracture exists.
2. Identifies the specific fracture type.

The system processes X-ray images and generates an **AI radiology report with prediction confidence**.

---

# 🚀 Features

- Binary fracture detection (Fractured / Not Fractured)
- Fracture type classification (12 classes)
- AI-generated radiology report
- Confidence score for predictions
- Fast inference (~14 ms per image)
- Web interface for uploading X-ray images
- Model performance evaluation and analysis

---

# 🧠 Model Architecture

The project uses **Vision Transformer (ViT-B/16)**.

Unlike traditional CNNs, Vision Transformers divide images into patches and process them using transformer attention mechanisms.

Advantages:
- Captures global image relationships
- Effective for complex medical images
- Modern deep learning architecture

---

# 🔄 System Pipeline


User Uploads X-ray Image
│
▼
Image Preprocessing
(Resize 224x224, Tensor Conversion)
│
▼
Stage 1: Binary Fracture Detection Model
(Vision Transformer)
│
├── No Fracture → Stop
│
▼
Stage 2: Fracture Type Classification Model
(12 Fracture Types)
│
▼
AI Diagnosis Report
(Prediction + Confidence Score)
│
▼
Results Displayed in Web Interface


---

# 📂 Project Structure


bone-fracture-ai
│
├── app.py # Streamlit frontend
├── train.py # Model training script
├── evaluate.py # Model evaluation
├── predict_pipeline.py # Prediction pipeline
├── model.py # Vision Transformer model
├── data_loader.py # Data loading and preprocessing
│
├── models/ # Trained models
│ ├── binary_model.pth
│ └── type_model.pth
│
├── model_performance_analysis.csv
├── final_results.csv
│
├── requirements.txt # Python dependencies
└── README.md


---

# 📊 Model Performance

### Binary Fracture Detection

| Metric | Value |
|------|------|
Accuracy | **91.2%**
Precision | 90.2%
Recall | 91.1%
F1 Score | 91.1%

### Fracture Type Classification

| Metric | Value |
|------|------|
Accuracy | **84.49%**

### Inference Speed


~0.014 seconds per image


---

# 🦴 Fracture Types Supported

The system classifies the following fracture types:

- Avulsion
- Comminuted
- Compression
- Fracture
- Greenstick
- Hairline
- Impacted
- Intra-articular
- Longitudinal
- Oblique
- Pathological
- Spiral

---

# ⚙️ Training Configuration

| Parameter | Value |
|----------|------|
Batch Size | 32
Epochs | 15
Learning Rate | 0.0001
Optimizer | Adam
Loss Function | CrossEntropyLoss
Image Size | 224×224

---

# 📈 Evaluation Metrics

The system was evaluated using:

- Accuracy
- Precision
- Recall
- F1 Score
- Confusion Matrix
- AUC-ROC
- Inference Time
- Cross Validation

Evaluation results are stored in:


final_results.csv


Training metrics are stored in:


model_performance_analysis.csv


---

# 💻 Installation

Clone the repository:

```bash
git clone https://github.com/YOUR_USERNAME/bone-fracture-ai.git

Navigate into the folder:

cd bone-fracture-ai

Install dependencies:

pip install -r requirements.txt
▶️ Run the Application

Start the Streamlit web interface:

streamlit run app.py

Upload an X-ray image and the AI system will analyze it.

📷 Example Output
AI RADIOLOGY REPORT

Result: Fracture Detected
Confidence: 98%

Fracture Type: Spiral
Type Confidence: 85%

Recommendation:
Consult an orthopedic specialist.
🏥 Applications

Medical decision support

Radiology assistance

Remote healthcare diagnostics

Medical education and training

⚠️ Limitations

Model performance depends on dataset quality

Some fracture types have similar visual patterns

The system is intended to assist doctors, not replace them

🔮 Future Improvements

Larger medical datasets

Explainable AI (Grad-CAM)

Mobile application integration

Hospital system integration

👨‍💻 Author

Jatin Kumar

AI / Machine Learning Project

📜 License

This project is for educational and research purposes only.