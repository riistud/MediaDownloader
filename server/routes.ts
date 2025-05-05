import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import fetch from "node-fetch";
import * as path from "path";
import * as fs from "fs";
import archiver from "archiver";

export async function registerRoutes(app: Express): Promise<Server> {
  // API endpoint for TikTok video download
  app.get("/api/download/tiktok", async (req, res) => {
    try {
      const { url } = req.query;
      
      if (!url || typeof url !== "string") {
        return res.status(400).json({ 
          status: false, 
          message: "URL parameter is required" 
        });
      }
      
      if (!url.includes("tiktok.com")) {
        return res.status(400).json({ 
          status: false, 
          message: "Invalid TikTok URL" 
        });
      }
      
      const apiUrl = `https://api.riicode.my.id/api/download/tiktokdl?url=${encodeURIComponent(url)}`;
      const response = await fetch(apiUrl);
      
      if (!response.ok) {
        return res.status(response.status).json({ 
          status: false, 
          message: "Failed to fetch video from external API" 
        });
      }
      
      const data = await response.json();
      return res.json(data);
    } catch (error) {
      console.error("TikTok download error:", error);
      return res.status(500).json({ 
        status: false, 
        message: "Server error while processing your request" 
      });
    }
  });
  
  // API endpoint for Instagram video download
  app.get("/api/download/instagram", async (req, res) => {
    try {
      const { url } = req.query;
      
      if (!url || typeof url !== "string") {
        return res.status(400).json({ 
          status: false, 
          message: "URL parameter is required" 
        });
      }
      
      if (!url.includes("instagram.com")) {
        return res.status(400).json({ 
          status: false, 
          message: "Invalid Instagram URL" 
        });
      }
      
      const apiUrl = `https://api.riicode.my.id/api/download/igdl?url=${encodeURIComponent(url)}`;
      const response = await fetch(apiUrl);
      
      if (!response.ok) {
        return res.status(response.status).json({ 
          status: false, 
          message: "Failed to fetch video from external API" 
        });
      }
      
      const data = await response.json();
      return res.json(data);
    } catch (error) {
      console.error("Instagram download error:", error);
      return res.status(500).json({ 
        status: false, 
        message: "Server error while processing your request" 
      });
    }
  });

  // API endpoint to download source code as ZIP
  app.get("/api/download/source", async (req, res) => {
    try {
      const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
      const zipFilename = `rcdl-source-${timestamp}.zip`;
      const zipFilePath = path.join(process.cwd(), zipFilename);
      
      // Create a file to stream archive data to
      const output = fs.createWriteStream(zipFilePath);
      const archive = archiver("zip", {
        zlib: { level: 9 } // Best compression
      });
      
      // Listen for errors
      archive.on("error", (err: Error) => {
        console.error("Archive error:", err);
        res.status(500).json({
          status: false,
          message: "Failed to create source code archive"
        });
      });
      
      // Pipe archive data to the file
      archive.pipe(output);
      
      // Add files and directories to the archive
      const directoriesToZip = [
        "client",
        "server",
        "shared",
        "db"
      ];
      
      const filesToZip = [
        "package.json",
        "tsconfig.json",
        "vite.config.ts",
        "tailwind.config.ts",
        "drizzle.config.ts",
        "postcss.config.js",
        "components.json"
      ];
      
      // Add directories with all their files
      directoriesToZip.forEach(dir => {
        const dirPath = path.join(process.cwd(), dir);
        if (fs.existsSync(dirPath)) {
          archive.directory(dirPath, dir);
        }
      });
      
      // Add individual files
      filesToZip.forEach(file => {
        const filePath = path.join(process.cwd(), file);
        if (fs.existsSync(filePath)) {
          archive.file(filePath, { name: file });
        }
      });
      
      // Finalize the archive
      await archive.finalize();
      
      // Wait for the file to be written completely
      output.on("close", () => {
        // Send file for download
        res.download(zipFilePath, zipFilename, (err) => {
          if (err) {
            console.error("Download error:", err);
          }
          
          // Clean up - delete the zip file after sending
          fs.unlink(zipFilePath, (unlinkErr) => {
            if (unlinkErr) {
              console.error("Failed to delete temporary zip file:", unlinkErr);
            }
          });
        });
      });
    } catch (error) {
      console.error("Source download error:", error);
      return res.status(500).json({
        status: false,
        message: "Server error while creating source archive"
      });
    }
  });

  const httpServer = createServer(app);
  
  return httpServer;
}
