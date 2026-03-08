import torch
from PIL import Image
from torchvision import transforms
from model import create_model
import torch.nn.functional as F


device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

transform = transforms.Compose([
    transforms.Resize((224,224)),
    transforms.ToTensor(),
])

binary_classes = ["fractured","not_fractured"]

type_classes = [
"Avulsion","Comminuted","Compression","Fracture","Greenstick",
"Hairline","Impacted","Intra-articular","Longitudinal",
"Oblique","Pathological","Spiral"
]


# ---------- LOAD MODELS ----------

binary_model = create_model(2)
binary_model.load_state_dict(torch.load("models/binary_model.pth", map_location=device))
binary_model.to(device)
binary_model.eval()

type_model = create_model(12)
type_model.load_state_dict(torch.load("models/type_model.pth", map_location=device))
type_model.to(device)
type_model.eval()


# ---------- REPORT GENERATOR ----------

def generate_report(image_path, result, confidence, fracture_type=None, type_confidence=None):

    report = f"""
==============================
        AI RADIOLOGY REPORT
==============================

Image File: {image_path}

Diagnosis Result
----------------
Result: {result}
Confidence: {confidence:.2f}%
"""

    if fracture_type is not None:
        report += f"""
Fracture Type Analysis
----------------------
Type: {fracture_type}
Type Confidence: {type_confidence:.2f}%
"""

    report += """
Recommendation
--------------
Please consult an orthopedic specialist
for professional medical evaluation.

Note
----
This AI system provides assistance only
and should not replace clinical diagnosis.

==============================
"""

    print(report)

    with open("diagnosis_report.txt", "w") as f:
        f.write(report)


# ---------- PREDICTION PIPELINE ----------

def predict(image_path):

    image = Image.open(image_path).convert("RGB")
    image_tensor = transform(image).unsqueeze(0).to(device)

    # ---------- STAGE 1 : FRACTURE DETECTION ----------

    with torch.no_grad():

        output = binary_model(image_tensor)

        probs = F.softmax(output, dim=1)
        confidence, pred = torch.max(probs, 1)

        fracture_result = binary_classes[pred.item()]
        confidence_score = confidence.item() * 100

        if fracture_result == "not_fractured":

            generate_report(
                image_path,
                "No Fracture Detected",
                confidence_score
            )

            return

    # ---------- STAGE 2 : FRACTURE TYPE ----------

    with torch.no_grad():

        output = type_model(image_tensor)

        probs = F.softmax(output, dim=1)
        confidence, pred = torch.max(probs, 1)

        fracture_type = type_classes[pred.item()]
        type_confidence = confidence.item() * 100

        generate_report(
            image_path,
            "Fracture Detected",
            confidence_score,
            fracture_type,
            type_confidence
        )


# ---------- RUN ----------

if __name__ == "__main__":

    path = input("Enter image path: ")
    predict(path)