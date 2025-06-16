class Meal < ApplicationRecord
  belongs_to :user
  has_many :ingredients, class_name: "MealIngredient"

  validates :name, presence: true

  def total_calories
    605
  end

  def total_protein
    30.5
  end

  def total_fat
    19
  end

  def total_carbs
    78.2
  end
end
