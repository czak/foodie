require "rails_helper"

RSpec.describe "meals routes", type: :routing do
  example "day meals index" do
    expect(get: "/2025-05-15/meals").to route_to(
      controller: "meals",
      action: "index",
      date: "2025-05-15",
    )
  end

  example "day meal details" do
    expect(get: "/2025-05-15/meals/7").to route_to(
      controller: "meals",
      action: "show",
      date: "2025-05-15",
      id: "7",
    )
  end
end
