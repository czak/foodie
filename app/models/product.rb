class Product < ApplicationRecord
  ALLOWED_PORTION_TYPES = %w[cup spoon unit].freeze

  belongs_to :user

  validates :name, presence: true
  validates :calories, numericality: { only_integer: true, greater_than_or_equal_to: 0 }
  validates :protein, numericality: { greater_than_or_equal_to: 0 }
  validates :fat, numericality: { greater_than_or_equal_to: 0 }
  validates :carbs, numericality: { greater_than_or_equal_to: 0 }
  validates :portion_type, inclusion: { in: ALLOWED_PORTION_TYPES, allow_nil: true }
  validates :portion_size, numericality: { only_integer: true, allow_nil: true }
  validates :portion_size, presence: true, if: :portion_type?

  normalizes :portion_type, with: ->(portion_type) { portion_type.presence }

  before_save -> { self.portion_size = nil }, if: -> { portion_type.blank? }
end
