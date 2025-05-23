import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["form"];

  showForm(event) {
    event.preventDefault();
    this.formTarget.classList.remove("hidden");
    this.formTarget.querySelector('input:not([type="hidden"])')?.focus();
  }
}
