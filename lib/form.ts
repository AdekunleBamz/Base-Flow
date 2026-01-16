// Form utilities
export function serializeForm(form: HTMLFormElement): Record<string, any> {
  const formData = new FormData(form);
  const data: Record<string, any> = {};

  formData.forEach((value, key) => {
    if (data[key]) {
      if (Array.isArray(data[key])) {
        data[key].push(value);
      } else {
        data[key] = [data[key], value];
      }
    } else {
      data[key] = value;
    }
  });

  return data;
}

export function deserializeForm(form: HTMLFormElement, data: Record<string, any>): void {
  Object.entries(data).forEach(([key, value]) => {
    const elements = form.elements.namedItem(key);
    
    if (elements instanceof RadioNodeList) {
      elements.forEach((element) => {
        if (element instanceof HTMLInputElement) {
          if (element.type === 'checkbox' || element.type === 'radio') {
            element.checked = Array.isArray(value)
              ? value.includes(element.value)
              : element.value === value;
          } else {
            element.value = value;
          }
        }
      });
    } else if (elements instanceof HTMLInputElement || elements instanceof HTMLTextAreaElement) {
      elements.value = value;
    } else if (elements instanceof HTMLSelectElement) {
      elements.value = value;
    }
  });
}

export function validateForm(
  form: HTMLFormElement,
  rules: Record<string, (value: any) => string | null>
): Record<string, string> {
  const errors: Record<string, string> = {};
  const data = serializeForm(form);

  Object.entries(rules).forEach(([field, validator]) => {
    const error = validator(data[field]);
    if (error) {
      errors[field] = error;
    }
  });

  return errors;
}

export function resetForm(form: HTMLFormElement): void {
  form.reset();
}

export function getFormValues(form: HTMLFormElement): Record<string, any> {
  return serializeForm(form);
}

export function setFormValues(form: HTMLFormElement, values: Record<string, any>): void {
  deserializeForm(form, values);
}
