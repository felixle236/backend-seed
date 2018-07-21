export default class DateHelper {
    static convertStartDate(date: string | Date): Date | undefined {
        if (!date)
            return undefined;
        let d;

        if (typeof date === 'string')
            d = new Date(date);
        else
            d = date;

        return new Date(d.getFullYear(), d.getMonth(), d.getDate());
    }

    static convertEndDate(date: string | Date): Date | undefined {
        if (!date)
            return undefined;
        let d;

        if (typeof date === 'string')
            d = new Date(date);
        else
            d = date;

        d = new Date(d.getFullYear(), d.getMonth(), d.getDate());
        d = DateHelper.addDays(d, 1);

        return DateHelper.addSeconds(d, -1);
    }

    static addSeconds(date: Date, seconds: number): Date {
        date.setSeconds(date.getSeconds() + seconds);
        return date;
    }

    static addMinutes(date: Date, minutes: number): Date {
        date.setMinutes(date.getMinutes() + minutes);
        return date;
    }

    static addHours(date: Date, hours: number): Date {
        date.setHours(date.getHours() + hours);
        return date;
    }

    static addDays(date: Date, days: number): Date {
        date.setDate(date.getDate() + days);
        return date;
    }

    static addMonths(date: Date, months: number): Date {
        date.setMonth(date.getMonth() + months);
        return date;
    }

    static addYears(date: Date, years: number): Date {
        date.setFullYear(date.getFullYear() + years);
        return date;
    }
}
