import { fetch } from "./dataAccess";

export const getPathsFromHydraResponse = async (response,isEdit: boolean) => {
try {
    const concatPath=isEdit?"/edit":"";
    const view = response.data['{{{hydraPrefix}}}view'];
    const paths = response.data["{{{hydraPrefix}}}member"].map(({{{lc}}}) => `${ {{~lc}}['@id'] }${concatPath}`);

    if (view) {
        const {
          '{{{hydraPrefix}}}last': last
        } = view;
        for (let page = 2; page <= parseInt(last.replace(/^\/{{{name}}}\?page=(\d+)/, '$1')); page++) {
          paths.concat(
            await fetch(`/{{{name}}}?page=${page}`).data["{{{hydraPrefix}}}member"].map(({{{lc}}}) => `${ {{~lc}}['@id'] }${concatPath}`)
        );
        }    
    }
    return paths
  } catch (e) {
    console.error(e);

    return  []
  }
}