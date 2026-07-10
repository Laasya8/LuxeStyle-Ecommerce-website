/** Placeholder handler for endpoints whose business logic lands in a later build phase. */
export const notImplemented = (phaseLabel) => (req, res) => {
  res.status(501).json({
    success: false,
    message: `Not implemented yet — ${phaseLabel}`,
  });
};
