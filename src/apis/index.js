import handleDownloadAsExcel from './handleDownloadAsExcel';

function createApiRoutes(app) {
  app.get('/download/records', handleDownloadAsExcel);
}

export default createApiRoutes;
