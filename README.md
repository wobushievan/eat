# 人生累计饮食估算小程序

一个基于微信原生小程序实现的本地估算工具。用户填写固定 8 项信息后，按统一规则估算截至今天累计吃了多少熟主食和盐，并换算成更容易理解的生活化单位。

## 如何运行

1. 在项目根目录执行 `npm install`
2. 打开微信开发者工具
3. 选择“导入项目”，项目目录指向当前仓库根目录 `D:\EvanCodex\eat`
4. AppID 可先使用测试号或 `touristappid`
5. 导入后确认小程序根目录为 `miniprogram/`
6. 如需跑测试，在根目录执行 `npm test`

## 项目目录说明

```text
miniprogram/
  app.ts
  pages/            页面层：首页、表单、结果、历史、说明、隐私
  components/       通用组件：按钮、卡片、步骤头、结果卡、比例滑杆等
  constants/        所有算法参数、枚举、固定文案、存储 key
  services/         计算服务和本地存储服务
  store/            轻量会话态，承接表单页与结果页之间的数据
  types/            类型定义
  utils/            日期、数字、格式化、表单工具
tests/
  calc.spec.ts      基础单元测试
```

## 算法配置文件位置

- 熟主食基准和修正参数：`miniprogram/constants/grain.ts`
- 盐基准和修正参数：`miniprogram/constants/salt.ts`
- 省份枚举：`miniprogram/constants/province.ts`
- 省份分组：`miniprogram/constants/provinceGroups.ts`
- 年龄段边界：`miniprogram/constants/stages.ts`
- 展示单位：`miniprogram/constants/units.ts`
- 本地存储 key：`miniprogram/constants/storage.ts`

## 如何调整参数

1. 修改 `constants/` 里的配置常量
2. 保持字段名与结构不变
3. 页面层无需改动，计算服务会自动使用新参数
4. 若修改了年龄段或展示阈值，建议同步更新 `tests/calc.spec.ts`

## 当前口径说明

- 熟主食采用“折粮基准 × 性别因子 × 体型因子 × 活动强度因子 × 熟食换算系数 × 省份熟食修正因子”
- 盐采用“年龄段盐基准 × 省份盐修正因子 × 口味因子 × 外食因子 × 活动轻微修正因子”
- 生命周期按 10 个年龄段逐段累加，按真实出生日期到今天精确到天切分
- 18 岁前使用 `childhoodProvince`，18 岁后使用 `adultProvince`
- 结果仅为统一规则下的有趣估算，不代表真实医学记录

## 已实现内容

- 完整页面流：首页、分步表单、结果页、历史页、说明页、隐私页
- 核心计算服务与展示单位换算
- 本地历史记录保存、查看、删除、清空
- `TripleRatioSlider` 联动比例组件
- 基础单元测试

## 注意事项

- V1 仅本地存储，不接登录、不接服务端、不做云同步
- 历史详情复用结果页打开，以保持页面结构与需求页清单一致
