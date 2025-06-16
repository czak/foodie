# This file should ensure the existence of records required to run the application in every environment (production,
# development, test). The code here should be idempotent so that it can be executed at any point in every environment.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).
#
# Example:
#
#   ["Action", "Comedy", "Drama", "Horror"].each do |genre_name|
#     MovieGenre.find_or_create_by!(name: genre_name)
#   end

user = User.first!

[
  ["Tortilla pszenna", 312, 9.0, 6.9, 52.0, nil, nil],
  ["Ryż biały ugotowany", 130, 2.7, 0.3, 28.2, nil, nil],
  ["Pomidor cherry", 19, 1.0, 0.0, 3.9, nil, nil],
  ["Twaróg delikatny president", 115, 8.8, 7.0, 3.9, nil, nil],
  ["Łosoś wędzony na gorąco", 212, 23.0, 12.0, 0.2, nil, nil],
  ["Mieszanka orzechów bakador", 637, 19.0, 57.0, 5.4, nil, nil],
  ["Mieszanka owoców leśnych", 48, 1.1, 0.5, 6.5, nil, nil],
  ["Whey isolate black", 365, 85.0, 1.6, 2.6, nil, nil],
  ["Whey natural protein", 393, 79.8, 5.6, 5.8, nil, nil],
  ["Mleko 1.5%", 35, 3.0, 0.5, 4.7, nil, nil],
  ["Ananas", 50, 0.5, 0.1, 13.1, nil, nil]
].each do |name, calories, protein, fat, carbs, portion_type, portion_size|
  Product.find_or_create_by(user: user, name: name) do |p|
    p.calories = calories
    p.protein = protein
    p.fat = fat
    p.carbs = carbs
    p.portion_type = portion_type
    p.portion_size = portion_size
  end
end
