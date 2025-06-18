// // import { createWriteStream } from "fs";
// // import { dirname, join } from "path";
// // import PDFDocument from "pdfkit";
// // import { Certificate } from "../models/certificate.model.js";
// // import { fileURLToPath } from "url";



// // // Manually define __dirname for ES module
// // const __filename = fileURLToPath(import.meta.url);
// // const _dirname = dirname(_filename);

// // const generateCertificate = async (req, res) => {
// //     const { userId, courseId, userName, courseName } = req.body;

// //     if (!userId || !courseId || !userName || !courseName) {
// //         return res.status(400).json({ error: "All fields are required" });
// //     }

// //     try {
// //         // Create a PDF document
// //         const doc = new PDFDocument();
// //         const certPath = join(__dirname, ../certificates/${userId}_${courseId}.pdf);

// //         doc.pipe(createWriteStream(certPath));

// //         doc.fontSize(24).text("Course Completion Certificate", { align: "center" });
// //         doc.moveDown();
// //         doc.fontSize(18).text(This is to certify that, { align: "center" });
// //         doc.moveDown();
// //         doc.fontSize(22).text(${userName}, { align: "center", bold: true });
// //         doc.moveDown();
// //         doc.fontSize(18).text(has successfully completed the course, { align: "center" });
// //         doc.moveDown();
// //         doc.fontSize(22).text("${courseName}", { align: "center", bold: true });
// //         doc.moveDown();
// //         doc.fontSize(16).text(Date: ${new Date().toLocaleDateString()}, { align: "center" });

// //         doc.end();

// //         // Store certificate in the database
// //         const certificate = new Certificate({
// //             userId,
// //             courseId,
// //             certificateUrl: /certificates/${userId}_${courseId}.pdf,
// //         });

// //         await certificate.save();

// //         return res.json({ message: "Certificate generated successfully", certificateUrl: certificate.certificateUrl });
// //     } catch (error) {
// //         console.error(error);
// //         res.status(500).json({ error: "Error generating certificate" });
// //     }
// // };

// // export default generateCertificate;


// import { createWriteStream, existsSync, mkdirSync } from "fs";
// import { dirname, join } from "path";
// import PDFDocument from "pdfkit";
// import { Certificate } from "../models/certificate.model.js";
// import { fileURLToPath } from "url";

// // Manually define __dirname for ES module
// const __filename = fileURLToPath(import.meta.url);
// const _dirname = dirname(_filename);

// const generateCertificate = async (req, res) => {
//     const { userId, courseId, userName, courseName } = req.body;

//     if (!userId || !courseId || !userName || !courseName) {
//         return res.status(400).json({ error: "All fields are required" });
//     }

//     try {
//         // Define the certificates directory
//         const certificatesDir = join(__dirname, "../certificates");

//         // Check if the certificates directory exists, if not, create it
//         if (!existsSync(certificatesDir)) {
//             mkdirSync(certificatesDir, { recursive: true });
//         }

//         // Define the certificate file path
//         const certPath = join(certificatesDir, ${userId}_${courseId}.pdf);

//         // Create a PDF document
//         const doc = new PDFDocument();
//         const writeStream = createWriteStream(certPath);
//         doc.pipe(writeStream);

//         doc.fontSize(24).text("Course Completion Certificate", { align: "center" });
//         doc.moveDown();
//         doc.fontSize(18).text(This is to certify that, { align: "center" });
//         doc.moveDown();
//         doc.fontSize(22).text(${userName}, { align: "center", bold: true });
//         doc.moveDown();
//         doc.fontSize(18).text(has successfully completed the course, { align: "center" });
//         doc.moveDown();
//         doc.fontSize(22).text("${courseName}", { align: "center", bold: true });
//         doc.moveDown();
//         doc.fontSize(16).text(Date: ${new Date().toLocaleDateString()}, { align: "center" });

//         doc.end();

//         // Wait for the PDF file to be written before sending a response
//         writeStream.on("finish", async () => {
//             // Store certificate in the database
//             const certificate = new Certificate({
//                 userId,
//                 courseId,
//                 certificateUrl: /certificates/${userId}_${courseId}.pdf,
//             });

//             await certificate.save();

//             return res.json({ 
//                 message: "Certificate generated successfully", 
//                 certificateUrl: certificate.certificateUrl 
//             });
//         });

//         writeStream.on("error", (err) => {
//             console.error(err);
//             res.status(500).json({ error: "Error generating certificate" });
//         });

//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: "Error generating certificate" });
//     }
// };

// export default generateCertificate;


import { createWriteStream, existsSync, mkdirSync } from "fs";
import { dirname, join } from "path";
import PDFDocument from "pdfkit";
import { Certificate } from "../models/certificate.model.js";
import { fileURLToPath } from "url";

// Manually define __dirname for ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const certificatesDir = join(__dirname, "../certificates");

// Ensure the certificates directory exists
if (!existsSync(certificatesDir)) {
    mkdirSync(certificatesDir, { recursive: true });
}

const generateCertificate = async (req, res) => {
    const { userId, courseId, userName, courseName } = req.body;

    if (!userId || !courseId || !userName || !courseName) {
        return res.status(400).json({ error: "All fields are required" });
    }

    try {
        // Define file path
        const certFileName = `${userId}_${courseId}.pdf`;
        const certPath = join(certificatesDir, certFileName);

        // Create a PDF document
        const doc = new PDFDocument();
        const writeStream = createWriteStream(certPath);
        doc.pipe(writeStream);

        // Add certificate content
        doc.fontSize(24).text("Course Completion Certificate", { align: "center" });
        doc.moveDown();
        doc.fontSize(18).text(`This is to certify that`, { align: "center" });
        doc.moveDown();
        doc.fontSize(22).text(`${userName}`, { align: "center", bold: true });
        doc.moveDown();
        doc.fontSize(18).text(`has successfully completed the course`, { align: "center" });
        doc.moveDown();
        doc.fontSize(22).text(`${courseName}`, { align: "center", bold: true });
        doc.moveDown();
        doc.fontSize(16).text(`Date: ${new Date().toLocaleDateString()}`, { align: "center" });

        doc.end();

        // Wait for the file to be fully written before responding
        writeStream.on("finish", async () => {
            // Store certificate in the database
            const certificate = new Certificate({
                userId,
                courseId,
                certificateUrl: `/api/v1/certificate/${certFileName}`,
            });

            await certificate.save();

            return res.json({
                message: "Certificate generated successfully",
                certificateUrl: certificate.certificateUrl,
            });
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error generating certificate" });
    }
};

export default generateCertificate;