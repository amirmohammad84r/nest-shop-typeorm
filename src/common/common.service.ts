import { BadRequestException, Injectable } from '@nestjs/common';
// import dayjs from "dayjs";
// import jalaliday from "jalaliday";
// dayjs.extend(jalaliday);

@Injectable()
export class CommonService {


    combineDiffBeforeAfter(before: any, after: any) {
        const keys = Object.keys(before);
        console.log(before)
        console.log(after)
        let changesBefore = {}
        let changesAfter = {}
        let changes = {}
        keys.forEach(key => {
            if (key !== 'createdAt' && key !== 'updatedAt') {
                if (before[key] !== after[key]) {
                    changesBefore[key] = before[key]
                    changesAfter[key] = after[key]
                }
            }
        })
        changes = { changesBefore, changesAfter }
        return changes
    }
    findModuleByFAName(module: string) {
        const modules = {
            "ادرس ها": "addresses",
            "ادمین": "admin",
            "کارت": "cart",
            "دسته بندی": "categories",
            "نظرات": "comments",
            "کد تخفیف": "coupon",
            "لاگ ها": "logs",
            "سفارشات": "order",
            "پرداخت ها": "payment",
            "محصولات": "products",
            "کاربران": "user",
        }
        let resault: string[] = []
        Object.entries(modules).forEach(([fa, en]) => {
            if (fa.includes(module)) {
                resault.unshift(en)
            }
        });
        return resault
    }


    // gregoryToJalali(date: Date) {

    //     return new Date(dayjs(date)
    //         .calendar("jalali")
    //         .format("YYYY/MM/DD HH:mm:ss"))

    // }
    // jalaliToGregory(date: Date) {

    //     return new Date(dayjs(date, { jalali: true })
    //         .calendar("jalali")
    //         .format("YYYY/MM/DD HH:mm:ss"))

    // }

}
