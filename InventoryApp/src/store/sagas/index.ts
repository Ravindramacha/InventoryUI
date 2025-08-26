import { all, fork } from 'redux-saga/effects';
import { inventorySaga } from './inventorySaga.js';
import { authSaga } from './authSaga.js';
import { vendorSaga } from './vendorSaga.js';

// Root saga that combines all sagas
export default function* rootSaga() {
  yield all([fork(inventorySaga), fork(authSaga), fork(vendorSaga)]);
}
