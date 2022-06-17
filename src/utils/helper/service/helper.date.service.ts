import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import moment from 'moment-timezone';
import {
    ENUM_HELPER_DATE_DIFF,
    ENUM_HELPER_DATE_FORMAT,
    IHelperDateFormatOptions,
} from '../helper.constant';

@Injectable()
export class HelperDateService {
    private readonly tz: string;

    constructor(private readonly configService: ConfigService) {
        this.tz = this.configService.get<string>('app.timezone');
    }

    calculateAge(dateOfBirth: Date): number {
        return moment().diff(dateOfBirth, 'years');
    }

    diff(dateOne: Date, dateTwo: Date, format?: ENUM_HELPER_DATE_DIFF): number {
        const mDateOne = moment(dateOne);
        const mDateTwo = moment(dateTwo);
        const diff = moment.duration(mDateTwo.diff(mDateOne));

        if (format === 'milis') {
            return diff.asMilliseconds();
        } else if (format === 'seconds') {
            return diff.asSeconds();
        } else if (format === 'hours') {
            return diff.asHours();
        } else if (format === 'days') {
            return diff.asDays();
        } else {
            return diff.asMinutes();
        }
    }

    check(date: string | number): boolean {
        return moment(date, true).isValid();
    }

    create(date?: string | Date | number): Date {
        return moment(date, true).toDate();
    }

    timestamp(date?: string | Date): number {
        return moment(date, true).valueOf();
    }

    format(date: Date, options?: IHelperDateFormatOptions): string {
        return moment(date)
            .tz(options && options.timezone ? options.timezone : this.tz)
            .format(
                options && options.format
                    ? options.format
                    : ENUM_HELPER_DATE_FORMAT.DATE
            );
    }

    forwardInMinutes(minutes: number, fromDate?: Date): Date {
        return moment(fromDate, true).add(minutes, 'm').toDate();
    }

    backwardInMinutes(minutes: number, fromDate?: Date): Date {
        return moment(fromDate, true).subtract(minutes, 'm').toDate();
    }

    forwardInDays(days: number, fromDate?: Date): Date {
        return moment(fromDate, true).add(days, 'd').toDate();
    }

    backwardInDays(days: number, fromDate?: Date): Date {
        return moment(fromDate, true).subtract(days, 'd').toDate();
    }

    forwardInMonths(months: number, fromDate?: Date): Date {
        return moment(fromDate, true).add(months, 'M').toDate();
    }

    backwardInMonths(months: number, fromDate?: Date): Date {
        return moment(fromDate, true).subtract(months, 'M').toDate();
    }

    endOfMonth(month: number, year?: number): Date {
        year = year || moment().year();
        return moment()
            .year(year)
            .month(month - 1)
            .endOf('month')
            .toDate();
    }

    startOfMonth(month: number, year?: number): Date {
        year = year || moment().year();
        return moment()
            .year(year)
            .month(month - 1)
            .startOf('month')
            .toDate();
    }

    endOfYear(year: number): Date {
        return moment().year(year).endOf('year').toDate();
    }

    startOfYear(year: number): Date {
        return moment().year(year).startOf('year').toDate();
    }
}
