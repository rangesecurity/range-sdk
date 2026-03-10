export function fillFindings(
  template: string,
  variables: { [key: string]: string }
): string {
  return template.replace(
    /\{\{(\w+)\}\}/g,
    (_, key) => variables[key] || 'unknown'
  );
}
