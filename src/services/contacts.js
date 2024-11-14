import ContactCollection from '../db/Models/Contact.js';

import { calculatePaginationData } from '../utils/calculatePaginationData.js';

export const getContacts = async ({
  page = 1,
  perPage = 10,
  sortBy = '_id',
  sortOrder = 'asc',
  filter = {},
}) => {
  const query = ContactCollection.find();

  if (filter.contactType) {
    query.where('contactType').equals(filter.contactType);
  }
  if (typeof filter.isFavourite === 'boolean') {
    query.where('isFavourite').equals(filter.isFavourite);
  }
  if (filter.userId) {
    query.where('userId').equals(filter.userId);
  }

  const totalItems = await ContactCollection.find()
    .merge(query)
    .countDocuments();
  const skip = (page - 1) * perPage;

  const data = await query
    .skip(skip)
    .limit(perPage)
    .sort({ [sortBy]: sortOrder });
  const paginationData = calculatePaginationData({ totalItems, page, perPage });

  return {
    data,
    ...paginationData,
  };
};

export const getContactById = (id) => ContactCollection.findById(id);

export const addContact = (payload) => ContactCollection.create(payload);

export const updateContact = async ({ _id, payload, options = {} }) => {
  const rawResult = await ContactCollection.findOneAndUpdate({ _id }, payload, {
    ...options,
    new: true,
    includeResultMetadata: true,
  });

  if (!rawResult || !rawResult.value) return null;

  return {
    data: rawResult.value,
    isNew: Boolean(rawResult.lastErrorObject.upserted),
  };
};

export const deleteContact = (filter) =>
  ContactCollection.findOneAndDelete(filter);
