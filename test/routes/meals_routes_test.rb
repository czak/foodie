require "test_helper"

class MealsRoutesTest < ActionDispatch::IntegrationTest
  test "root redirects to today's meals" do
    get "/"
    assert_redirected_to "/#{Date.today.iso8601}/meals"
  end

  test "day meals index" do
    assert_routing "/2025-05-15/meals", { controller: "meals", action: "index", date: "2025-05-15" }
  end

  test "day meal details" do
    assert_routing "/2025-05-15/meals/7", { controller: "meals", action: "show", date: "2025-05-15", id: "7" }
  end
end
