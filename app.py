import streamlit as st
from predict_pipeline import predict
from PIL import Image
import tempfile

st.title("🦴 Bone Fracture Detection AI")

uploaded_file = st.file_uploader("Upload X-ray Image", type=["jpg","jpeg","png"])

if uploaded_file is not None:

    image = Image.open(uploaded_file)
    st.image(image, caption="Uploaded X-ray", use_container_width=True)

    if st.button("Analyze X-ray"):

        with tempfile.NamedTemporaryFile(delete=False, suffix=".jpg") as tmp_file:
            tmp_file.write(uploaded_file.getbuffer())
            temp_path = tmp_file.name

        st.write("🔍 Running AI analysis...")

        predict(temp_path)

        st.success("Analysis Complete ✅")

        with open("diagnosis_report.txt","r") as f:
            report = f.read()

        st.text(report)