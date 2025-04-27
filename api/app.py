from flask import Flask, request, jsonify
from ultralytics import solutions
import base64
import io
from PIL import Image
import numpy as np

app = Flask(__name__)

# Squat hareketini izleyen AIGym başlatma
gym_squat = solutions.AIGym(
    show=False,  # Sonuçları ekranda göstermiyoruz
    kpts=[5, 11, 13, 15],  # Squat için anahtar noktalar
    up_angle=160.0,
    down_angle=90.0,
    model="yolo11n-pose.pt"
)

@app.route('/squat', methods=['POST'])
def track_squat():
    data = request.get_json()
    image_data = data.get('image', None)

    # Eğer görsel verisi gelmediyse
    if not image_data:
        return jsonify({'status': 'No image data received'}), 400

    try:
        # Base64 verisini decode et
        img_data = base64.b64decode(image_data)

        # Görüntüyü Pillow ile aç
        image = Image.open(io.BytesIO(img_data))
        frame = np.array(image)

        # Squat hareketini izleme
        results = gym_squat.monitor(frame)
        squat_angle = gym_squat.angle[0] if gym_squat.angle else None

        return jsonify({'squat_angle': squat_angle}), 200

    except Exception as e:
        return jsonify({'status': 'Error processing image', 'error': str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001)