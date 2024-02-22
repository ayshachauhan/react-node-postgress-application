if (!process.env.LISTENING_TO_UNHANDLED_REJECTION) {
  process.on('unhandledRejection', (error: any, _promise: Promise<any>) => {
    // We throw an error here to make sure the tests fail.
    // Without this, unhandled rejections in failing tests will pass and give false positives.
    const trace: string | undefined =
      error.stack
        ?.split('\n')
        .filter((line: string) => !line.includes('node_modules'))
        .join('\n') || error.message;
    expect(trace).toBeUndefined();
  });

  // Avoid memory leak by adding too many listeners
  process.env.LISTENING_TO_UNHANDLED_REJECTION = 'true';
}

// This ensures all tests have at least one assertion.
// Incase an uncaught error is thrown the test could give a false positive.
beforeEach(() => {
  expect.hasAssertions();
});
