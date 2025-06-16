require "rails_helper"

RSpec.describe "Meals", type: :request do
  fixtures :users, :meals

  def sign_in_as(user)
    post session_url, params: { username: user.username, password: "password" }
  end

  describe "GET meals#index" do
    it "requires authentication" do
      get meals_url(date: "2025-05-15")
      expect(response).to redirect_to(new_session_url)
    end

    context "when authenticated" do
      before { sign_in_as(users(:joe)) }

      it "lists user's meals for given day" do
        target_date = meals(:joe_monday_breakfast).date
        get meals_url(date: target_date.iso8601)

        expect(response).to be_successful
        content = response.parsed_body.content

        # Contains all meals for this user for this day
        expect(content).to include(meals(:joe_monday_breakfast).name)
        expect(content).to include(meals(:joe_monday_lunch).name)

        # Does not contain meals from other days or other users
        expect(content).not_to include(meals(:joe_tuesday_breakfast).name)
        expect(content).not_to include(meals(:sue_monday_breakfast).name)
      end

      it "redirects to root if date is invalid" do
        get meals_url(date: "invalid")
        expect(response).to redirect_to(root_url)
      end
    end
  end

  describe "POST meals#create" do
    before { sign_in_as(users(:joe)) }

    it "creates a new meal" do
      expect do
        post meals_url(
          date: "2025-05-15",
          params: {
            meal: {
              name: "Dinner"
            }
          }
        )
      end.to change { Meal.count }.by(1)

      expect(response).to redirect_to(meals_url("2025-05-15"))
    end
  end
end
