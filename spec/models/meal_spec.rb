require 'rails_helper'

RSpec.describe Meal, type: :model do
  fixtures :users

  context "validations" do
    it "requires a name" do
      meal = Meal.new(user: users(:joe))
      expect(meal).to_not be_valid
      expect(meal.errors.messages).to eq({ name: ["can't be blank"] })
    end
  end
end
