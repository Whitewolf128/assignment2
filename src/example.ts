// variables
// Primary data type annotations
// Typscript includes colon data type
let projectName: string = "Backend API";
let version: number = 1.0;
let isActive: boolean = true;
let tags: string[] = ["api", "backend", "typescript"];


// functions
// ARROW FUNCTION name = (params and type): return type =>

/**
 * Calculates the uptime percentage based on total and downtime hours
 * @param totalHours - Total hours in the period
 * @param downtimeHours - Hours the system was down
 * @returns The uptime percentage as a number
 */
const calculateUptime = (totalHours: number, downtimeHours: number): number => {
    if (totalHours <= 0) {
        return 0;
    }

    const uptime: number = ((totalHours - downtimeHours) / totalHours) * 100;

    // rounding to 2 decimal places
    return Math.round(uptime * 100) / 100;
}

// if there is not return the type would be : void
const add = (number1: number, number2: number): void => {}

/**
 * Determines the service status based on uptime percentage
 * @param uptimePercentage - The uptime percentage
 * @returns A status string indicating service health
 */
const getServiceStatus = (uptimePercentage: number): string => {
    switch (true) {
        case uptimePercentage >= 99.9:
            return "excellent";
        case uptimePercentage >= 99.0:
            return "good";
        case uptimePercentage >= 95.0:
            return "acceptable";
        default:
            return "poor";
    }
}

const uptime: number = calculateUptime(720, 2);
const serverStatus: string = getServiceStatus(uptime);

console.log(`Uptime: ${uptime}%, Status: ${serverStatus}`);