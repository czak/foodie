class Meal < ApplicationRecord
  belongs_to :user

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
