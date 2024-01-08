import { randomId } from "../lib/uid";
import { getAttachmentsFromTestCases } from "./tests";
import { TestCaseWithClientId, VideoAttachment } from "./types";

export function getVideoInformation(
  testCases: TestCaseWithClientId[]
):
  | { type: "hasVideo"; path: string; name: string | null }
  | { type: "noVideo" } {
  const attachments = getAttachmentsFromTestCases(testCases);
  const videos = attachments.filter((a) => a.contentType.startsWith("video"));
  // what happens if we have more than 1 video? Cypress just seems to send a video boolean
  const selectedVideo = videos[0];
  return selectedVideo && selectedVideo.path
    ? { type: "hasVideo", path: selectedVideo.path, name: selectedVideo.name }
    : { type: "noVideo" };
}

export function getVideoAttachments(
  testCases: TestCaseWithClientId[]
): VideoAttachment[] {
  return getAttachmentsFromTestCases(testCases)
    .filter((a) => a.contentType.startsWith("video"))
    .map((a) => ({
      ...a,
      id: randomId(),
    }));
}
