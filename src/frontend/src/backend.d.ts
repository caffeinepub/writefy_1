import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface DocumentMeta {
    id: string;
    lastEdited: bigint;
    formatType: string;
    title: string;
    owner: Principal;
}
export interface Document {
    id: string;
    lastEdited: bigint;
    formatType: string;
    title: string;
    content: string;
    owner: Principal;
}
export interface backendInterface {
    createDocument(id: string, title: string, content: string, formatType: string): Promise<void>;
    deleteDocument(id: string): Promise<void>;
    getAllDocumentsMeta(): Promise<Array<DocumentMeta>>;
    getDocument(id: string): Promise<Document>;
    getDocumentMeta(id: string): Promise<DocumentMeta>;
    updateDocument(id: string, title: string, content: string): Promise<void>;
}
