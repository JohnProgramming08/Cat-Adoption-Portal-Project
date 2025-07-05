from main import app, db, Cat
import random

# Cat names and bios for variety
cat_names = [
    "Whiskers", "Shadow", "Luna", "Max", "Bella", "Charlie", "Lucy", "Oliver", 
    "Milo", "Lily", "Simba", "Nala", "Tiger", "Smokey", "Princess", "Buddy",
    "Mittens", "Patches", "Oreo", "Ginger", "Snowball", "Boots", "Felix", "Coco",
    "Jasper", "Ruby", "Oscar", "Zoe", "Leo", "Chloe", "Sebastian", "Mia",
    "Garfield", "Tabitha", "Romeo", "Juliet", "Chester", "Willow", "Bandit", "Angel",
    "Pumpkin", "Pepper", "Storm", "Honey", "Zeus", "Athena", "Duke", "Duchess",
    "Midnight", "Snowflake", "Copper", "Pearl", "Phoenix", "Raven", "Sage", "Ivory"
]

cat_bios = [
    "A playful and energetic cat who loves to chase toys.",
    "Very affectionate and loves to cuddle with humans.",
    "Independent but friendly, perfect for busy families.",
    "Loves to explore and is very curious about everything.",
    "Gentle and calm, great with children and other pets.",
    "Vocal and chatty, always has something to say.",
    "Loves to nap in sunny spots and is very relaxed.",
    "Playful hunter who enjoys interactive toys.",
    "Sweet and loving, follows you around the house.",
    "Shy at first but warms up quickly to new people.",
    "Athletic and loves to climb and jump.",
    "Food motivated and loves treats and mealtime.",
    "Enjoys being petted and purrs constantly.",
    "Intelligent and can learn tricks easily.",
    "Loves attention and being the center of focus.",
    "Calm and peaceful, perfect lap cat.",
    "Adventurous and loves outdoor supervised time.",
    "Social butterfly who gets along with everyone.",
    "Protective and loyal to their favorite humans.",
    "Mischievous and loves to get into everything.",
    "Graceful and elegant with beautiful movements.",
    "Friendly and outgoing with visitors.",
    "Loves to play with water and splash around.",
    "Quiet and observant, watches everything carefully.",
    "Energetic young cat who needs lots of playtime.",
    "Senior cat who is wise and gentle.",
    "Loves to hide in small spaces and boxes.",
    "Very clean and meticulous about grooming.",
    "Enjoys puzzle toys and mental stimulation.",
    "Therapeutic presence, very calming to be around."
]

# Room numbers (assuming 2-digit room numbers)
rooms = [f"{i:02d}" for i in range(1, 51)]  # Rooms 01-50

def generate_test_cats():
    with app.app_context():
        print("Generating test cat data...")
        
        for i in range(50):  # Generate 50 test cats
            name = random.choice(cat_names)
            bio = random.choice(cat_bios)
            age = random.randint(1, 15)  # Cats aged 1-15 years
            gender = random.choice(['M', 'F'])
            room = random.choice(rooms)
            
            # Check if this name already exists, if so, add a number
            existing_cat = Cat.query.filter_by(name=name).first()
            if existing_cat:
                name = f"{name}{i+1}"
            
            cat = Cat(
                name=name,
                bio=bio,
                age=age,
                gender=gender,
                image="test_cat1.jpeg",  # All cats use the same test image
                room=room,
                adopted=False
            )
            
            db.session.add(cat)
            print(f"Added: {name} - {gender}, Age {age}, Room {room}")
        
        db.session.commit()
        print(f"\nSuccessfully generated 50 test cats!")
        print("All cats are using 'test_cat1.jpeg' as their image.")

if __name__ == "__main__":
    generate_test_cats()
