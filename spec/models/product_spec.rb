require 'rails_helper'

RSpec.describe Product, type: :model do
  fixtures :products

  it "clears portion_size if portion_type is cleared" do
    product = products(:egg)
    expect { product.update!(portion_type: nil) }
      .to change { product.portion_size }
      .from(60)
      .to(nil)
  end

  it "accepts only predefined portion types" do
    product = products(:egg)
    product.portion_type = "bucket"
    expect(product).to_not be_valid
    expect(product.errors[:portion_type]).to eq(["is not included in the list"])
  end
end
