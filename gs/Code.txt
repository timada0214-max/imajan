"use strict";

function doGet(event) {
  try {
    const action = getRequestAction_(event, {});
    const data = routeApiRequest_(action, null);

    return createSuccessResponse_(data);
  } catch (error) {
    return createErrorResponse_(error);
  }
}

function doPost(event) {
  try {
    const requestBody = parsePostBody_(event);
    const action = getRequestAction_(event, requestBody);
    const payload = requestBody.payload || null;
    const data = routeApiRequest_(action, payload);

    return createSuccessResponse_(data);
  } catch (error) {
    return createErrorResponse_(error);
  }
}
