const API_BASE_URL = "http://127.0.0.1:8000";

export interface UploadResponse {
    project_id: string;
    repository_root: string;
    repository_name: string;
    status: string;
}

export interface AnalyzeResponse {
    project_id: string;
    repository_name: string;
    total_files: number;

    technologies: {
        frontend: string[];
        backend: string[];
        database: string[];
        ai: string[];
        containerization: string[];
        package_manager: string[];
        languages: string[];
    };

    important_files: number;
    relationships: number;
    summaries: number;
}

export async function uploadRepository(
    file: File
): Promise<UploadResponse> {

    const formData = new FormData();

    formData.append("file", file);

    const response = await fetch(
        `${API_BASE_URL}/upload/`,
        {
            method: "POST",
            body: formData,
        }
    );

    if (!response.ok) {
        throw new Error("Repository upload failed.");
    }

    return await response.json();
}

export async function analyzeRepository(
    projectId: string
): Promise<AnalyzeResponse> {

    const response = await fetch(
        `${API_BASE_URL}/analyze/${projectId}`,
        {
            method: "POST",
        }
    );

    if (!response.ok) {
        throw new Error("Repository analysis failed.");
    }

    return await response.json();
}

export async function generateDocumentation(
    projectId: string,
    technicalLevel: string,
    productContext: string,
    onProgress: (data: any) => void,
    onSection: (data: any) => void,
    onCompleted: (data: any) => void,
    onError: (message: string) => void
) {

    console.log("========== START GENERATION ==========");

    const response = await fetch(
        `${API_BASE_URL}/generate/stream`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                project_id: projectId,
                technical_level: technicalLevel,
                product_context: productContext,
            }),
        }
    );

    console.log("Connected to stream");
    console.log("Response Status:", response.status);
    console.log("Response Headers:");

    response.headers.forEach((value, key) => {
        console.log(`${key}: ${value}`);
    });

    if (!response.ok) {

        onError("Generation failed.");

        return;
    }

    const reader = response.body?.getReader();

    if (!reader) {

        console.error("No reader returned.");

        onError("Unable to open stream.");

        return;
    }

    const decoder = new TextDecoder();

    let buffer = "";

//     while (true) {

//         const { done, value } = await reader.read();

//         console.log("-----------------------------");
//         console.log("Chunk Received");
//         console.log("Done:", done);
//         console.log("Bytes:", value?.length);

//         if (done) {

//             console.log("Stream Finished");

//             break;

//         }

//         const decoded = decoder.decode(value, {
//             stream: true,
//         });

//         console.log("Decoded Chunk (raw):");
//         console.log(JSON.stringify(decoded));

//         buffer += decoded;

//         console.log("Current Buffer:");
//         console.log(buffer);

//         const events = buffer.split("\n\n");

//         buffer = events.pop() || "";

//         console.log("Events Found:", events.length);

//         for (const event of events) {

//             console.log("Raw Event:");
//             console.log(event);

//             const lines = event.split("\n");

//             let eventName = "";
//             let eventData = "";

//             for (const line of lines) {

//                 if (line.startsWith("event:")) {

//                     eventName = line.substring(6).trim();

//                 }

//                 if (line.startsWith("data:")) {

//                     eventData = line.substring(5).trim();

//                 }

//             }

//             console.log("Event Name:", eventName);
//             console.log("Raw Data:", eventData);

//             if (!eventName || !eventData) {

//                 console.warn("Skipping incomplete event.");

//                 continue;

//             }

//             try {

//                 const parsed = JSON.parse(eventData);

//                 console.log("Parsed Event:", parsed);

//                 switch (eventName) {

//                     case "progress":

//                         console.log("Calling onProgress()");
//                         onProgress(parsed);
//                         break;

//                     case "section":

//                         console.log("Calling onSection()");
//                         onSection(parsed);
//                         break;

//                     case "completed":

//                         console.log("Calling onCompleted()");
//                         onCompleted(parsed);
//                         break;

//                     case "error":

//                         console.log("Calling onError()");
//                         onError(parsed.message);
//                         break;

//                     default:

//                         console.warn("Unknown Event:", eventName);

//                 }

//             }

//             catch (err) {

//                 console.error("JSON Parse Error");
//                 console.error(err);
//                 console.error(eventData);

//             }

//         }

//     }

//     console.log("========== END GENERATION ==========");
// }

    while (true) {

    const { done, value } = await reader.read();

    if (done) {

        console.log("Stream Finished");

        break;

    }

    buffer += decoder.decode(value, {
        stream: true,
    });

    // Normalize line endings
    buffer = buffer.replace(/\r\n/g, "\n");

    while (true) {

        const separatorIndex = buffer.indexOf("\n\n");

        if (separatorIndex === -1) {

            break;

        }

        const rawEvent = buffer.slice(0, separatorIndex);

        buffer = buffer.slice(separatorIndex + 2);

        if (!rawEvent.trim()) {

            continue;

        }

        let eventName = "";
        const dataLines: string[] = [];

        const lines = rawEvent.split("\n");

        for (const line of lines) {

            if (line.startsWith("event:")) {

                eventName = line.substring(6).trim();

            }

            else if (line.startsWith("data:")) {

                dataLines.push(line.substring(5).trim());

            }

        }

        if (!eventName || dataLines.length === 0) {

            continue;

        }

        try {

            const parsed = JSON.parse(dataLines.join("\n"));

            console.log("Received Event:", eventName, parsed);

            switch (eventName) {

                case "progress":

                    onProgress(parsed);
                    break;

                case "section":

                    onSection(parsed);
                    break;

                case "completed":

                    onCompleted(parsed);
                    break;

                case "error":

                    onError(parsed.message);
                    break;

            }

        }

        catch (err) {

            console.error("Failed to parse SSE event");

            console.error(rawEvent);

            console.error(err);

        }

    }
    }
}