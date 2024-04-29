import React, { useState, useEffect } from "react";
import "../App.css";
import "@aws-amplify/ui-react/styles.css";
import { generateClient, post, get } from 'aws-amplify/api';
import {
    Button,
    Flex,
    Heading,
    Image,
    Text,
    TextField,
    View,
} from "@aws-amplify/ui-react";
import { listNotes } from "../graphql/queries";
import {
    createNote as createNoteMutation,
    deleteNote as deleteNoteMutation,
} from "../graphql/mutations";

const Notes = () => {
    const client = generateClient();
    const [notes, setNotes] = useState([]);

    useEffect(() => {
        fetchNotes();
        getScanData();
        triggerScan();
    }, []);

    async function getScanData() {
        try {
            const restOperation = get({
                apiName: 'webPresenceCloud',
                path: '/get-scan-data',
                options: {
                    queryParams: {
                        email: 'test@gmail.com'
                    }
                }
            });

            console.log(restOperation)

            const { body } = await restOperation.response;
            const response = await body.json();

            console.log('GET call succeeded');
            console.log(response);
        } catch (e) {
            console.log('GET call failed: ', JSON.parse(e.response.body));
        }
    }

    async function triggerScan() {
        try {
            const restOperation = get({
                apiName: 'webPresenceCloud',
                path: '/trigger-scan',
                options: {
                    queryParams: {
                        email: 'test@gmail.com'
                    }
                }
            });

            const { body } = await restOperation.response;
            const response = await body.json();

            console.log('GET call succeeded');
            console.log(response);
        } catch (e) {
            console.log('GET call failed: ', JSON.parse(e.response.body));
        }
    }


    // async function postTodo() {
    //     try {
    //       const restOperation = post({
    //         apiName: 'test',
    //         path: '/user',
    //         options: {
    //           body: {
    //             message: 'Mow the lawn'
    //           }
    //         }
    //       });
      
    //       const { body } = await restOperation.response;
    //       const response = await body.json();
      
    //       console.log('POST call succeeded');
    //       console.log(response);
    //     } catch (e) {
    //       console.log('POST call failed: ', JSON.parse(e.response.body));
    //     }
    //   }

    async function fetchNotes() {
        const apiData = await client.graphql({ query: listNotes });
        const notesFromAPI = apiData.data.listNotes.items;
        await Promise.all(
            notesFromAPI.map(async (note) => {
                // if (note.image) {
                //   const url = await Amplify.Storage.get(note.name);
                //   note.image = url;
                // }
                return note;
            })
        );
        setNotes(notesFromAPI);
    }

    async function createNote(event) {
        event.preventDefault();
        const form = new FormData(event.target);
        const image = form.get("image");
        const data = {
            name: form.get("name"),
            description: form.get("description"),
            image: image.name,
        };
        // if (!!data.image) await Amplify.Storage.put(data.name, image, {});
        await client.graphql({
            query: createNoteMutation,
            variables: { input: data },
        });
        fetchNotes();
        event.target.reset();
    }

    async function deleteNote({ id, name }) {
        const newNotes = notes.filter((note) => note.id !== id);
        setNotes(newNotes);
        // await Amplify.Storage.remove(name);
        await client.graphql({
            query: deleteNoteMutation,
            variables: { input: { id } },
        });
    }
    return (
        <View className="App">
            <Heading level={1}>My Notes App</Heading>
            <View as="form" margin="3rem 0" onSubmit={createNote}>
                <Flex direction="row" justifyContent="center">
                    <TextField
                        name="name"
                        placeholder="Note Name"
                        label="Note Name"
                        labelHidden
                        variation="quiet"
                        required
                    />
                    <TextField
                        name="description"
                        placeholder="Note Description"
                        label="Note Description"
                        labelHidden
                        variation="quiet"
                        required
                    />
                    <View
                        name="image"
                        as="input"
                        type="file"
                        style={{ alignSelf: "end" }}
                    />
                    <Button type="submit" variation="primary">
                        Create Note
                    </Button>
                </Flex>
            </View>
            <Heading level={2}>Current Notes</Heading>
            <View margin="3rem 0">
                {notes.map((note) => (
                    <Flex
                        key={note.id || note.name}
                        direction="row"
                        justifyContent="center"
                        alignItems="center"
                    >
                        <Text as="strong" fontWeight={700}>
                            {note.name}
                        </Text>
                        <Text as="span">{note.description}</Text>
                        {note.image && (
                            <Image
                                src={note.image}
                                alt={`visual aid for ${notes.name}`}
                                style={{ width: 400 }}
                            />
                        )}
                        <Button variation="link" onClick={() => deleteNote(note)}>
                            Delete note
                        </Button>
                    </Flex>
                ))}
            </View>
        </View>
    )
}

export default Notes;