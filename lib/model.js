class Message
{
	constructor(text, author)
	{
		this.id = undefined;
		this.text = text;
		this.author = author;
		this.attachments = [];
	}

	attach(attachment)
	{
		if (Array.isArray(attachment))
		{
			attachment.forEach(item => this.attachments.push(item));
		}
		else
		{
			this.attachments.push(attachment);
		}
	}

	serialize(writer)
	{
		writer.withCollection(Attachment.COLLECTION);
		this.attachments.forEach(att => att.serialize(writer));
		writer
			.withCollection(Message.COLLECTION)
			.write({
				id: this.id,
				text: this.text,
				author: this.author,
				attachments: this.attachments.map(att => att.id)
			});
		return writer;
	}

	deserialize(id, reader)
	{
		// TODO
		reader
			.withCollection(Message.COLLECTION)
			.find({ id })
			.wait()
			.then(results => {
				if (results.length === 1)
				{
					const m = results[0];
					this.id = m.id;
					// this.
				}
			});
		reader
			.withCollection(Attachment.COLLECTION);
	}
}
Message.COLLECTION = 'messages';

class Attachment
{
	constructor(type, value)
	{
		this.id = undefined;
		this.type = type;
		this.value = value;
	}

	serialize(writer)
	{
		return writer.write({
			id: this.id,
			type: this.type,
			value: this.value
		});
	}
}
Attachment.COLLECTION = 'attachments';
Attachment.TYPE_IMAGE = 'att_type_image';
Attachment.TYPE_FILE = 'att_type_file';
