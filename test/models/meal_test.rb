require "test_helper"

class MealTest < ActiveSupport::TestCase
  test "requires a name" do
    meal = Meal.new(user: users(:joe))
    assert_not meal.valid?
    assert_equal({ name: ["can't be blank"] }, meal.errors.messages)
  end
end
