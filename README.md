# demo_vue3.x_canlendar

## 介绍

 使用 vue3 + ts 实现的移动端日历组件

## 插件使用

- 农历日历 [lunar-calendar](https://github.com/zzyss86/LunarCalendar)

```
  npm install lunar-calendar

  @param {Number} year 公历年 范围[1891-2100]
  @param {Number} month 公历月 范围[1-12]
  @param {Number} day 公历日 范围[1-31]

   LunarCalendar.solarToLunar(year,month,day) // 将公历转换为农历
```

## Vue3 + ts 踩坑

- 调用第三方插件的时候，需要在`shime-vue,d,ts`中导入插件的模
块
```
  // 导入日历组件
  declare module 'lunar-calendar' 
```