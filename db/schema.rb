# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[8.0].define(version: 2025_05_11_210739) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "pg_catalog.plpgsql"

  create_table "products", force: :cascade do |t|
    t.integer "user_id", null: false
    t.string "name", null: false
    t.integer "calories", null: false
    t.decimal "protein", precision: 5, scale: 2, null: false
    t.decimal "fat", precision: 5, scale: 2, null: false
    t.decimal "carbs", precision: 5, scale: 2, null: false
    t.string "portion_type"
    t.integer "portion_size"
    t.integer "next_version_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["next_version_id"], name: "index_products_on_next_version_id"
    t.index ["user_id"], name: "index_products_on_user_id"
  end

  create_table "sessions", force: :cascade do |t|
    t.integer "user_id", null: false
    t.string "ip_address"
    t.string "user_agent"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["user_id"], name: "index_sessions_on_user_id"
  end

  create_table "users", force: :cascade do |t|
    t.string "username", null: false
    t.string "password_digest", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["username"], name: "index_users_on_username", unique: true
  end

  add_foreign_key "products", "products", column: "next_version_id"
  add_foreign_key "products", "users"
  add_foreign_key "sessions", "users"
end
