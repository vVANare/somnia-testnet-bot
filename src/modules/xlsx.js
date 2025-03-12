import ExcelJS from 'exceljs';
const walletsXlsxPath = './data/wallets.xlsx';
export const createWalletsXlsx = async (wallets) => {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Wallets');
    sheet.columns = [
        { header: 'ID', key: 'id', width: 5, style: { alignment: { horizontal: 'right' } } },
        { header: 'Toggle', key: 'toggle', width: 10, style: { alignment: { horizontal: 'center' } } },
        { header: 'Proxy (optional)', key: 'proxy', width: 10 },
        { header: 'Private Key', key: 'privateKey', width: 10 },
        { header: 'Address', key: 'address', width: 45 },
        { header: 'Explorer', key: 'explorerUrl', width: 10, style: { alignment: { horizontal: 'center' } } },
        { header: 'Balance $STT', key: 'balance', width: 10 },
        { header: '', key: 'empty', width: 9 },
    ];
    wallets.forEach((wallet) => {
        const row = sheet.addRow(wallet);
        if (wallet.explorerUrl)
            row.getCell(6).value = { text: 'LINK', hyperlink: wallet.explorerUrl };
        row.getCell(8).value = '';
    });
    await workbook.xlsx.writeFile(walletsXlsxPath);
};
export const getWalletsData = async () => {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(walletsXlsxPath);
    const sheet = workbook.getWorksheet('Wallets');
    if (!sheet)
        throw new Error('Sheet "Wallets" not found');
    const wallets = [];
    sheet.eachRow((row, rowIndex) => {
        if (rowIndex > 1) {
            const wallet = {
                id: parseInt(String(row.getCell(1).value || 0)),
                toggle: String(row.getCell(2).value || 'OFF').toUpperCase(),
                proxy: String(row.getCell(3).value || ''),
                privateKey: String(row.getCell(4).value || ''),
                address: String(row.getCell(5).value || ''),
                explorerUrl: String(row.getCell(6).value || ''),
                balance: parseFloat(String(row.getCell(7).value || 0)),
            };
            wallets.push(wallet);
        }
    });
    return wallets;
};
