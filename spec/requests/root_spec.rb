require 'rails_helper'

RSpec.describe "GET /", type: :request do
  it "redirects to today's meals" do
    get "/"
    expect(response).to redirect_to("/#{Date.today.iso8601}/meals")
  end
end
