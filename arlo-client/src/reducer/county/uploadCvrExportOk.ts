import { parse } from 'adapter/uploadCvrExport';

export default function uploadCvrExportOk(
    state: County.AppState,
    action: Action.UploadCvrExportOk,
): County.AppState {
    return { ...state, ...parse(action.data) };
}
