require "test_helper"

class ProductTest < ActiveSupport::TestCase
  test "clears portion_size if portion_type is cleared" do
    product = products(:egg)
    assert_changes -> { product.portion_size }, from: 60, to: nil do
      product.update!(portion_type: nil)
    end
  end

  test "accepts only predefined portion types" do
    product = products(:egg)
    product.portion_type = "bucket"
    assert_not product.valid?
    assert_equal ["is not included in the list"],  product.errors[:portion_type]
  end
end
