<template>
  <div class="calendar">
    <div class="header">
      <div class="header-left">
        <div class="month">{{ month + 1 }}月</div>
        <ul class="week-year">
          <li>{{ getWeekDay(weekDay) }}</li>
          <li>{{ year }}年</li>
        </ul>
      </div>
      <div class="header-right" @click="handleClickToday()">今</div>
    </div>
    <div class="content">
      <ul class="weeks">
        <li v-for="(item, index) in week" :key="index">{{ item }}</li>
      </ul>
      <ul class="days" @touchstart="handleTouchStart($event)" @touchend="handleTouchEnd($event)">
        <li
          class="day"
          v-for="(item, index) in dateList"
          :key="index"
          :class="{ isCurrentMonth: isCurrentMonth(item), isCurrentDay: isCurrentDay(item) }"
          @click="handleClickDay(item)"
        >
          <div>
            <b>{{ item.getDate() }}</b>
          </div>
          <div class="lunar">
            {{ getLunarCalendar(item) }}
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, toRefs } from 'vue'
import LunarCalendar from 'lunar-calendar'

// date 属性接口
interface DataProps {
  week: string[];
  year: number;
  month: number;
  day: number;
  weekDay: number;
  dateList: object[];
}

export default defineComponent({
  name: 'Calendar',
  setup () {
    const data: DataProps = reactive({
      // 日历属性
      week: ['日', '一', '二', '三', '四', '五', '六'],
      year: 0,
      month: 0,
      day: 0,
      weekDay: 0,
      dateList: []
    })

    //  获取日期
    const getNowDate = () => {
      const nowDate = new Date()
      data.year = nowDate.getFullYear()
      data.month = nowDate.getMonth()
      data.day = nowDate.getDate()
      data.weekDay = nowDate.getDay()
    }

    // 获得日期对应是周几
    const getWeekDay = (weekDay: number) => {
      switch (weekDay) {
        case 0:
          return '周日'
        case 1:
          return '周一'
        case 2:
          return '周二'
        case 3:
          return '周三'
        case 4:
          return '周四'
        case 5:
          return '周五'
        case 6:
          return '周六'
      }
    }

    // 生成日历
    const getCanlendar = () => {
      // 获取当月第一天对应是星期几
      const currentMonthFirstDay = new Date(data.year, data.month, 1)
      const currentWeekDay = currentMonthFirstDay.getDay()

      // 获取当月日历的开始的时间戳和日期，每周的开始为周日
      const startTimeStamp = currentMonthFirstDay.getTime() - currentWeekDay * 24 * 60 * 60 * 1000
      // const startDate = new Date(startTimeStamp)

      // 当月第一天对是否为星期5或6，如果是，则采取42格的日历，否则用35格的日历
      let calendarDaysNum = 0
      if (currentWeekDay === 5 || currentWeekDay === 6) {
        calendarDaysNum = 42
      } else {
        calendarDaysNum = 35
      }

      // 遍历出当月日历的所有日期
      const currentMonthDays = []
      for (let i = 0; i < calendarDaysNum; i++) {
        currentMonthDays.push(new Date(startTimeStamp + i * 24 * 60 * 60 * 1000))
      }
      data.dateList = currentMonthDays
    }

    // 根据阳历，生成阴历
    const getLunarCalendar = (item: Date) => {
      const lunarDateList = LunarCalendar.solarToLunar(
        item.getFullYear(),
        item.getMonth() + 1,
        item.getDate()
      )
      // 判断 节气/农历节日/农历
      if (lunarDateList.term) {
        return lunarDateList.term
      } else if (lunarDateList.lunarFestival) {
        return lunarDateList.lunarFestival
      } else {
        return lunarDateList.lunarDayName
      }
    }

    // 判断是否当月对应的天数，日历不是当月的 color 变灰色
    const isCurrentMonth = (item: Date) => {
      // 判断 1 月
      if (item.getFullYear() !== data.year && item.getMonth() === 0) {
        return true
        // 判断 12 月
      } else if (item.getFullYear() !== data.year && item.getMonth() === 11) {
        return true
      } else {
        return item.getFullYear() === data.year && item.getMonth() !== data.month
      }
    }

    // 判断选中的日期
    const isCurrentDay = (item: Date) => {
      return (
        item.getFullYear() === data.year &&
        item.getMonth() === data.month &&
        item.getDate() === data.day
      )
    }

    // 上一个月
    const handlePrevMonth = () => {
      if (data.month === 0) {
        data.year -= 1
        data.month = 11
      } else {
        data.month -= 1
      }
      getCanlendar()
    }

    //  下一个月
    const handleNextMonth = () => {
      if (data.month === 11) {
        data.year += 1
        data.month = 0
      } else {
        data.month += 1
      }
      getCanlendar()
    }

    // 点击某一天
    const handleClickDay = (item: Date) => {
      data.day = item.getDate()
      data.weekDay = item.getDay()
      // 判断点击的日历是否当月，不是就转跳
      if (item.getMonth() !== data.month) {
        item.getMonth() < data.month ? handlePrevMonth() : handleNextMonth()
      }
    }

    // 回到今天，直接初始化日历
    const handleClickToday = () => {
      getNowDate()
      getCanlendar()
    }

    // 获得 touchstart X轴位置
    let startX = 0
    const handleTouchStart = (e: any) => {
      startX = e.changedTouches[0].pageX
    }

    // 获得 touchend X轴位置，判断左滑还是右滑
    const handleTouchEnd = (e: any) => {
      const endX = e.changedTouches[0].pageX
      const distanceX = endX - startX
      if (distanceX > 50) {
        handlePrevMonth()
      } else if (distanceX < -10) {
        handleNextMonth()
      }
    }

    onMounted(() => {
      getNowDate()
      getCanlendar()
    })

    return {
      ...toRefs(data),
      getWeekDay,
      getLunarCalendar,
      isCurrentMonth,
      isCurrentDay,
      handleClickDay,
      handleClickToday,
      handleTouchStart,
      handleTouchEnd,
      handlePrevMonth,
      handleNextMonth
    }
  }
})
</script>

<style scoped lang="scss">
$myWidth: 14.2vw;
$myHeight: 10vh;
$myTheme: #b88282;

ul {
  list-style: none;
  margin: 0;
  padding: 0;
}

.header {
  width: 100%;
  height: $myHeight;
  display: flex;
  justify-content: space-around;
  align-items: center;
  background: $myTheme;
  .header-left {
    height: 100%;
    width: 80%;
    display: flex;
    align-items: center;
    .month {
      font-size: 30px;
    }
    .week-year {
      padding: 10px;
    }
  }
}

.content {
  background: #efefef;
  .weeks {
    display: flex;
    li {
      width: $myWidth;
      height: $myWidth;
      line-height: $myWidth;
      text-align: center;
      color: #999;
    }
  }
  .days {
    display: flex;
    flex-wrap: wrap;
    .day {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      box-sizing: border-box;
      width: $myWidth;
      height: $myWidth;
      font-size: 1.2rem;
      color: #333;
      .lunar {
        font-size: 0.7rem;
        color: #999;
      }
      .term {
        color: $myTheme;
      }
    }
    .isCurrentMonth {
      color: #999;
    }
    .isCurrentDay {
      border: 1px solid $myTheme;
      border-radius: $myWidth / 2;
      background: rgba($color: $myTheme, $alpha: 0.6);
    }
  }
}
</style>
