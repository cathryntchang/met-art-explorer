from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from datetime import datetime
import os

# Create and configure the application
app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + os.path.join(os.path.abspath(os.path.dirname(__file__)), 'favorites.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Initialize extensions
db = SQLAlchemy(app)
CORS(app, resources={r"/*": {"origins": "*"}})

# Artwork Model
class Favorite(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    object_id = db.Column(db.Integer, unique=True, nullable=False)
    title = db.Column(db.String(500), nullable=False)
    artist = db.Column(db.String(200), nullable=True)
    image_url = db.Column(db.String(1000), nullable=True)
    added_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'objectId': self.object_id,
            'title': self.title,
            'artist': self.artist,
            'imageUrl': self.image_url,
            'addedAt': self.added_at.isoformat() if self.added_at else None
        }

# Create database tables
def init_db():
    with app.app_context():
        db.create_all()

# Routes
@app.route('/favorites', methods=['GET'])
def get_favorites():
    favorites = Favorite.query.order_by(Favorite.added_at.desc()).all()
    return jsonify([fav.to_dict() for fav in favorites])

@app.route('/favorites', methods=['POST'])
def add_favorite():
    data = request.json
    
    # Validate required fields
    if not data or 'objectId' not in data or 'title' not in data:
        return jsonify({'error': 'Missing required fields'}), 400

    # Check if artwork already exists
    existing = Favorite.query.filter_by(object_id=data['objectId']).first()
    if existing:
        return jsonify({'error': 'Artwork already in favorites'}), 400

    # Create new favorite
    new_favorite = Favorite(
        object_id=data['objectId'],
        title=data['title'],
        artist=data.get('artist', 'Unknown'),
        image_url=data.get('imageUrl', '')
    )

    try:
        db.session.add(new_favorite)
        db.session.commit()
        return jsonify(new_favorite.to_dict()), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@app.route('/favorites/<int:object_id>', methods=['DELETE'])
def remove_favorite(object_id):
    favorite = Favorite.query.filter_by(object_id=object_id).first()
    
    if not favorite:
        return jsonify({'error': 'Artwork not found'}), 404

    try:
        db.session.delete(favorite)
        db.session.commit()
        return jsonify({'message': 'Artwork removed from favorites'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

# Initialize the database
init_db()

if __name__ == '__main__':
    app.run(debug=True, port=5000)