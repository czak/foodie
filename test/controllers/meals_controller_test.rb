require "test_helper"

class MealsControllerTest < ActionDispatch::IntegrationTest
  def sign_in_as(user)
    post session_url, params: { username: user.username, password: "password" }
  end

  test "requires authentication" do
    get meals_url(date: "2025-05-15")
    assert_redirected_to new_session_url
  end

  test "lists user's meals for given day" do
    sign_in_as users(:joe)

    target_date = meals(:joe_monday_breakfast).date
    get meals_url(date: target_date.iso8601)

    assert_response :success
    content = response.parsed_body.content

    # Contains all meals for this user for this day
    assert_includes content, meals(:joe_monday_breakfast).name
    assert_includes content, meals(:joe_monday_lunch).name

    # Does not contain meals from other days or other users
    assert_not_includes content, meals(:joe_tuesday_breakfast).name
    assert_not_includes content, meals(:sue_monday_breakfast).name
  end

  test "redirects to root if date is invalid" do
    sign_in_as users(:joe)
    get meals_url(date: "invalid")
    assert_redirected_to root_url
  end

  test "creates a new meal" do
    sign_in_as users(:joe)
    assert_difference 'Meal.count', 1 do
      post meals_url(date: "2025-05-15", params: { meal: { name: "Dinner" } })
    end
    assert_redirected_to meals_url('2025-05-15')
  end
end
