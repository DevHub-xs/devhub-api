describe('Simple Test Suite', () => {
  test('should pass basic assertion', () => {
    expect(1 + 1).toBe(2);
  });

  test('should verify environment', () => {
    expect(process.env.NODE_ENV).toBeDefined();
  });
});
