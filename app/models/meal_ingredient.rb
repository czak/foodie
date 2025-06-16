class MealIngredient < ApplicationRecord
  belongs_to :meal
  belongs_to :item, polymorphic: true

  delegate :name, to: :item

  def calories
    220
  end

  def protein
    9
  end

  def fat
    4.5
  end

  def carbs
    34
  end
end
