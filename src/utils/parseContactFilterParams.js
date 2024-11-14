const parseBooleanString = (value) => {
  if (typeof value !== 'string') return;
  if (!['true', 'false'].includes(value)) return;

  return value === 'true';
};

export const parseContactFilterParams = ({ type, isFavourite }) => {
  const parsedIsFavourite = parseBooleanString(isFavourite);

  const filter = {};

  if (type) {
    filter.contactType = type;
  }

  if (parsedIsFavourite !== undefined) {
    filter.isFavourite = parsedIsFavourite;
  }

  return filter;
};
