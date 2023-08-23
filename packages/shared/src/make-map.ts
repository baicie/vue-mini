
// 制造一个map并且返回一个方法去检查是否含有该key
export function makeMap(
  str:string,
  expectsLowerCase?:boolean
):(key:string)=>boolean{
    const map:Record<string,boolean> = Object.create(null);
    const list:Array<string> = str.split(',')
    for(let i=0; i<list.length; i){
      // 制作map {key:boolean}
      map[list[i]] = true;
    }

    // 转布尔值后取反
    return expectsLowerCase? val=> !!map[val.toLocaleLowerCase()] : val=>!!map[val]
}